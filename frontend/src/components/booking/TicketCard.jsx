import { useRef } from "react";
import { Calendar, MapPin, Clock, Download, XCircle } from "lucide-react";
import { formatDate, formatCurrency } from "../../utils/formatters";
import { STATUS_COLORS } from "../../utils/constants";
import Badge from "../common/Badge";
import { toast } from "react-toastify";

const TicketCard = ({ booking, onCancel }) => {
  const ticketRef = useRef(null);
  const event = booking.eventId;

  const handleDownload = async () => {
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(ticketRef.current, { scale: 2, backgroundColor: null });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width / 2, canvas.height / 2],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`ticket-${booking.ticketId}.pdf`);
    } catch {
      toast.error("Could not generate PDF. Please try again.");
    }
  };

  return (
    <div className="card overflow-hidden">
      <div ref={ticketRef} className="bg-white dark:bg-gray-900 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <Badge className={STATUS_COLORS[booking.bookingStatus]}>{booking.bookingStatus}</Badge>
              <Badge className={STATUS_COLORS[booking.paymentStatus === "paid" ? "approved" : "pending"]}>
                {booking.paymentStatus}
              </Badge>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{event?.title}</h3>
            <div className="mt-2 space-y-1 text-sm text-gray-500 dark:text-gray-400">
              <p className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {event?.date && formatDate(event.date)}</p>
              <p className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {event?.time}</p>
              <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {event?.venue}, {event?.city}</p>
            </div>
            <p className="mt-2 text-xs text-gray-400">Ticket ID: {booking.ticketId}</p>
          </div>
          {booking.qrCode && (
            <img src={booking.qrCode} alt="QR Code" className="h-24 w-24 rounded-lg border border-gray-100 dark:border-gray-800" />
          )}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3 text-center">
          <div>
            <p className="text-xs text-gray-500">Tickets</p>
            <p className="font-semibold text-gray-900 dark:text-white">{booking.ticketCount}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total</p>
            <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(booking.totalAmount)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Booked</p>
            <p className="font-semibold text-gray-900 dark:text-white">{formatDate(booking.createdAt)}</p>
          </div>
        </div>
      </div>

      <div className="flex border-t border-gray-100 dark:border-gray-800">
        <button onClick={handleDownload} className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10">
          <Download className="h-4 w-4" /> Download PDF
        </button>
        {!["cancelled", "rejected", "completed"].includes(booking.bookingStatus) && onCancel && (
          <button onClick={() => onCancel(booking)} className="flex flex-1 items-center justify-center gap-2 border-l border-gray-100 dark:border-gray-800 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">
            <XCircle className="h-4 w-4" /> Cancel Booking
          </button>
        )}
      </div>
    </div>
  );
};

export default TicketCard;
