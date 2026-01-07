'use client';

import React, { useEffect, useState } from 'react';
import { getProperty, updateProperty, getBookings } from '@/lib/api';
import Button from '@/components/ui/Button';
import { FiArrowLeft, FiChevronLeft, FiChevronRight, FiSave, FiCalendar } from 'react-icons/fi';
import { useRouter, useParams } from 'next/navigation';

export default function CalendarPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [property, setProperty] = useState<any>(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [availability, setAvailability] = useState<any[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);

    // Selection state
    const [selectionStart, setSelectionStart] = useState<string | null>(null);
    const [selectionEnd, setSelectionEnd] = useState<string | null>(null);
    const [hoverDate, setHoverDate] = useState<string | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);

    const [editData, setEditData] = useState({ price: 0, isBlocked: false });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            try {
                const [propData, bookingData] = await Promise.all([
                    getProperty(id),
                    getBookings({ propertyId: id })
                ]);

                if (propData) {
                    setProperty(propData);
                    setEditData(prev => ({ ...prev, price: propData.price })); // Default to property price
                    if (propData.availability) setAvailability(propData.availability);
                }
                if (bookingData) setBookings(bookingData);
            } catch (err) {
                console.error("Failed to fetch data", err);
            }
        };
        fetchData();
    }, [id]);

    const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const formatDateKey = (year: number, month: number, day: number) => {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    const getDayData = (dateKey: string) => {
        return availability.find((a: any) => new Date(a.date).toISOString().split('T')[0] === dateKey);
    };

    const normalizeDate = (dateStr: string | Date) => {
        const d = new Date(dateStr);
        d.setHours(0, 0, 0, 0);
        return d;
    };

    const isDateBooked = (dateKey: string) => {
        const target = normalizeDate(dateKey);
        return bookings.some((b: any) => {
            const start = normalizeDate(b.checkIn);
            const end = normalizeDate(b.checkOut);
            return target >= start && target <= end;
        });
    };

    const getBookingForDate = (dateKey: string) => {
        const target = normalizeDate(dateKey);
        return bookings.find((b: any) => {
            const start = normalizeDate(b.checkIn);
            const end = normalizeDate(b.checkOut);
            return target >= start && target <= end;
        });
    };

    const isPastDate = (dateKey: string) => {
        const target = normalizeDate(dateKey);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return target < today;
    };

    const handleDateClick = (dateKey: string) => {
        // First check if clicking a booking
        const booking = getBookingForDate(dateKey);
        if (booking) {
            setSelectedBooking(booking);
            setSelectionStart(dateKey);
            setSelectionEnd(null);
            return;
        }

        // If not a booking, clear previous booking selection
        setSelectedBooking(null);

        if (isPastDate(dateKey)) return; // Disable past dates for editing

        if (!selectionStart || (selectionStart && selectionEnd)) {
            // New selection
            setSelectionStart(dateKey);
            setSelectionEnd(null);

            // Set form to this day's current values
            const data = getDayData(dateKey);
            setEditData({
                price: data ? data.price : property.price,
                isBlocked: data ? data.isBlocked : false
            });
        } else {
            // Complete selection range
            if (new Date(dateKey) < new Date(selectionStart)) {
                setSelectionEnd(selectionStart);
                setSelectionStart(dateKey);
            } else {
                setSelectionEnd(dateKey);
            }
        }
    };

    const handleDateHover = (dateKey: string) => {
        if (selectionStart && !selectionEnd && !isPastDate(dateKey)) {
            setHoverDate(dateKey);
        }
    };

    const isInRange = (dateKey: string) => {
        if (!selectionStart) return false;

        if (selectedBooking) return dateKey === selectionStart;

        const target = new Date(dateKey);
        const start = new Date(selectionStart);
        let end = selectionEnd ? new Date(selectionEnd) : (hoverDate ? new Date(hoverDate) : null);

        if (!end) return dateKey === selectionStart;

        const rangeStart = start < end ? start : end;
        const rangeEnd = start < end ? end : start;

        return target >= rangeStart && target <= rangeEnd;
    };

    const handleSave = async () => {
        if (!selectionStart) return;
        setLoading(true);

        const start = new Date(selectionStart);
        const end = selectionEnd ? new Date(selectionEnd) : new Date(selectionStart);

        const loopStart = start < end ? start : end;
        const loopEnd = start < end ? end : start;

        const dateRange: string[] = [];
        for (let d = new Date(loopStart); d <= loopEnd; d.setDate(d.getDate() + 1)) {
            dateRange.push(d.toISOString().split('T')[0]);
        }

        let newAvailability = availability.filter((a: any) => {
            const aDate = new Date(a.date).toISOString().split('T')[0];
            return !dateRange.includes(aDate);
        });

        dateRange.forEach(dateStr => {
            newAvailability.push({
                date: new Date(dateStr),
                price: Number(editData.price),
                isBlocked: editData.isBlocked
            });
        });

        setAvailability(newAvailability);
        await updateProperty(id, { availability: newAvailability });
        setLoading(false);
        setSelectionStart(null);
        setSelectionEnd(null);
        setHoverDate(null);
    };

    if (!property) return <div className="p-8">Loading...</div>;

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    const calendarGrid = [];
    for (let i = 0; i < firstDay; i++) {
        calendarGrid.push(<div key={`empty-${i}`} className="h-24 bg-gray-50/50 border border-gray-100/50"></div>);
    }
    for (let d = 1; d <= daysInMonth; d++) {
        const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), d);
        const dayData = getDayData(dateKey);
        const isBlocked = dayData?.isBlocked;
        const isBooked = isDateBooked(dateKey);
        const isPast = isPastDate(dateKey);
        const price = dayData?.price || property.price;
        const selected = isInRange(dateKey);
        const isStart = dateKey === selectionStart;
        const isEnd = dateKey === (selectionEnd || hoverDate);

        let cellClass = `h-24 border border-gray-100 p-2 relative transition-all select-none group `;

        if (isBooked) {
            cellClass += "bg-purple-50/80 border-purple-100 ";
        } else if (isBlocked) {
            cellClass += "bg-red-50/80 border-red-100 ";
        } else if (selected) {
            cellClass += "bg-blue-50 border-blue-200 ";
        } else if (isPast) {
            cellClass += "bg-gray-50/50 text-gray-400 ";
        } else {
            cellClass += "bg-white hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5 ";
        }

        if (isPast) {
            cellClass += "cursor-not-allowed opacity-60 ";
        } else if (isBooked) {
            cellClass += "cursor-pointer "; // Booked dates are clickable now
        } else {
            cellClass += "cursor-pointer ";
        }

        if (selected && (isStart || isEnd) && !isPast && !isBooked) {
            cellClass += "ring-2 ring-primary ring-inset z-10 ";
        }
        if (selected && isBooked) {
            cellClass += "ring-2 ring-purple-500 ring-inset z-10 ";
        }

        calendarGrid.push(
            <div
                key={dateKey}
                onClick={() => (!isPast || isBooked) && handleDateClick(dateKey)}
                onMouseEnter={() => (!isPast) && handleDateHover(dateKey)}
                className={cellClass}
            >
                <div className="flex justify-between items-start">
                    <span className={`font-semibold ${selected && !isPast ? 'text-primary' : 'text-gray-700'}`}>{d}</span>
                    {isBooked && <span className="w-2 h-2 rounded-full bg-purple-400"></span>}
                </div>

                <div className="absolute bottom-2 right-2 text-right flex flex-col items-end gap-1">
                    {isBooked ? (
                        <span className="text-[10px] font-bold text-white bg-purple-500 px-1.5 py-0.5 rounded shadow-sm">BOOKED</span>
                    ) : isBlocked ? (
                        <span className="text-[10px] font-bold text-white bg-red-400 px-1.5 py-0.5 rounded shadow-sm">BLOCKED</span>
                    ) : (
                        <span className={`text-sm font-bold ${isPast ? 'text-gray-400' : 'text-green-600'}`}>
                            ₹{price.toLocaleString('en-IN')}
                        </span>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                    <FiArrowLeft size={24} className="text-gray-600" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold font-heading text-gray-900">Manage Schedule</h1>
                    <p className="text-gray-500 font-medium">{property.title}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Calendar */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">{monthName}</h2>
                        <div className="flex gap-2">
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={handlePrevMonth} className="cursor-pointer flex items-center gap-1">
                                    <FiChevronLeft /> Prev
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleNextMonth} className="cursor-pointer flex items-center gap-1">
                                    Next <FiChevronRight />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-0 mb-3">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest">{day}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {calendarGrid}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-6 text-sm border-t border-gray-100 pt-4">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-white border border-gray-300 rounded-full"></div> <span className="text-gray-600">Available</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-100 border border-purple-200 rounded-full"></div> <span className="text-gray-600">Booked</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-50 border border-red-200 rounded-full"></div> <span className="text-gray-600">Blocked</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded-full"></div> <span className="text-gray-400">Past</span></div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-fit sticky top-6">
                    {selectedBooking ? (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 border-b pb-2">Booking Details</h3>

                            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                                <div className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">Guest</div>
                                <div className="font-bold text-gray-900 text-lg">{selectedBooking.guestName}</div>
                                <div className="text-sm text-gray-600 mt-1">{selectedBooking.email}</div>
                                <div className="text-sm text-gray-600">{selectedBooking.phone}</div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Check-In</span>
                                    <span className="font-medium text-gray-900">{new Date(selectedBooking.checkIn).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Check-Out</span>
                                    <span className="font-medium text-gray-900">{new Date(selectedBooking.checkOut).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Guests</span>
                                    <span className="font-medium text-gray-900">{selectedBooking.guests} Adults</span>
                                </div>
                                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                                    <span className="font-bold text-gray-700">Total Price</span>
                                    <span className="font-bold text-purple-600 text-lg">₹{selectedBooking.totalPrice.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <Button onClick={() => {
                                setSelectedBooking(null);
                                setSelectionStart(null);
                            }} variant="outline" className="w-full justify-center text-gray-600">
                                Close Details
                            </Button>
                        </div>
                    ) : selectionStart ? (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Edit Availability</h3>

                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <span className="block text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">Selected Range</span>
                                <div className="text-gray-900 font-bold text-lg">
                                    {new Date(selectionStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    {selectionEnd && selectionStart !== selectionEnd && ` - ${new Date(selectionEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Price per Night</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                                    <input
                                        type="number"
                                        value={editData.price}
                                        onChange={(e) => setEditData({ ...editData, price: Number(e.target.value) })}
                                        className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-black transition-all font-medium"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Applies to all dates in selection.</p>
                            </div>

                            <div
                                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer border transition-all ${editData.isBlocked ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}
                                onClick={() => setEditData({ ...editData, isBlocked: !editData.isBlocked })}
                            >
                                <span className={`font-medium ${editData.isBlocked ? 'text-red-700' : 'text-gray-700'}`}>Mark Unavailable</span>
                                <div className={`w-12 h-6 rounded-full relative transition-colors ${editData.isBlocked ? 'bg-red-500' : 'bg-gray-300'}`}>
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${editData.isBlocked ? 'left-7' : 'left-1'}`}></div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button onClick={() => {
                                    setSelectionStart(null);
                                    setSelectionEnd(null);
                                    setHoverDate(null);
                                }} variant="ghost" className="flex-1 justify-center border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 cursor-pointer">
                                    Cancel
                                </Button>
                                <Button onClick={handleSave} isLoading={loading} className="flex-[2] justify-center py-3 text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer">
                                    <FiSave className="mr-2" /> Save
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 flex flex-col items-center gap-4 text-gray-400">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                <FiCalendar size={32} className="text-gray-300" />
                            </div>
                            <p className="max-w-[200px]">Click dates on the calendar to edit price or availability.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
