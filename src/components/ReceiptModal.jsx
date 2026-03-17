import { useEffect } from "react";

const ReceiptModal = ({ booking, isOpen, onClose }) => {
  if (!isOpen || !booking) return null;

  const property = booking.propertyId || {};

  const resolveImageUrl = (url) => {
    if (!url) return null;

    if (url.startsWith("http") || url.startsWith("data:")) return url;

    const base = import.meta.env.VITE_API_URL?.replace(/\/api$/, "") || "";

    return `${base}/${url.replace(/^\/+/, "")}`;
  };

  const fullRoomPrice = property.fullHousePrice || property.pricePerMonth || 0;
  const perSeatPrice = property.perSeatPrice || 0;

  const unitPrice =
    booking.bookingType === "fullRoom" ? fullRoomPrice : perSeatPrice;

  const quantity =
    booking.bookingType === "fullRoom" ? 1 : booking.seatsBooked || 1;

  const totalAmount = unitPrice * quantity * (booking.stayDuration || 1);

  const visitDate = booking.visitDate
    ? new Date(booking.visitDate).toLocaleDateString()
    : "Not scheduled";

  useEffect(() => {
    const handleAfterPrint = () => window.scrollTo(0, 0);

    window.addEventListener("afterprint", handleAfterPrint);

    return () => window.removeEventListener("afterprint", handleAfterPrint);
  }, []);

  const printReceipt = () => window.print();

  const receiptNumber =
    booking?._id?.toString().slice(-6).toUpperCase() || "000000";

  return (
    <>
      <style>
        {`
        @media print {
          body * { visibility: hidden; }

          #receipt-print,
          #receipt-print * {
            visibility: visible;
          }

          #receipt-print {
            position:absolute;
            left:0;
            top:0;
            width:100%;
            padding:20px;
          }

          .no-print {
            display:none;
          }
        }
        `}
      </style>

      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 no-print">

        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">

          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">

            <h2 className="text-2xl font-bold text-slate-900">
              Booking Receipt
            </h2>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-red-500 text-xl"
            >
              ✕
            </button>

          </div>

          {/* Receipt Content */}
          <div id="receipt-print" className="p-6 space-y-6">

            {/* Title */}
            <div className="text-center border-b pb-6">

              <h1 className="text-3xl font-bold">RECEIPT</h1>

              <p className="text-slate-500 text-sm">
                Booking Confirmation
              </p>

              <p className="text-xs text-slate-400 mt-2">
                Receipt #{receiptNumber}
              </p>

              <p className="text-xs text-slate-400">
                Date {new Date().toLocaleDateString()}
              </p>

            </div>

            {/* Property Details */}
            <section>

              <h3 className="font-semibold border-b pb-1 mb-2">
                Property Details
              </h3>

              <div className="text-sm space-y-1">

                <p>
                  Property: <span className="font-medium">{property.title || "-"}</span>
                </p>

                <p>
                  Location: {property.city || "-"}, {property.location || "-"}
                </p>

                <p>
                  BHK: {property.bhkType || "-"}
                </p>

                <p>
                  Booking Type: {booking.bookingType || "-"}
                </p>

              </div>

            </section>

            {/* Guest Details */}
            <section>

              <h3 className="font-semibold border-b pb-1 mb-2">
                Guest Information
              </h3>

              <div className="text-sm space-y-1">

                <p>
                  Name: {booking.guestId?.name || "-"}
                </p>

                <p>
                  Email: {booking.guestId?.email || "-"}
                </p>

                <p>
                  Visit Date: {visitDate}
                </p>

                <p>
                  Status: <span className="text-emerald-600 font-medium">Confirmed</span>
                </p>

              </div>

            </section>

            {/* Host Verification */}
            {booking.hostVerification && (
              <section>

                <h3 className="font-semibold border-b pb-1 mb-2">
                  Host Verification
                </h3>

                <div className="text-sm space-y-1">

                  <p>
                    Guest Name: {booking.hostVerification.guestName || "-"}
                  </p>

                  <p>
                    Address: {booking.hostVerification.address || "-"}
                  </p>

                  <p>
                    Pin Code: {booking.hostVerification.pinCode || "-"}
                  </p>

                  <p>
                    Aadhar: {booking.hostVerification.aadharNumber || "-"}
                  </p>

                </div>

              </section>
            )}

            {/* Images */}
            {(booking.professionalInfo?.passportPhoto ||
              booking.hostVerification?.verificationPhoto) && (

              <div className="flex gap-6 justify-center pt-4">

                {booking.professionalInfo?.passportPhoto && (
                  <div className="text-center">

                    <p className="text-xs text-slate-400 mb-1">
                      Passport
                    </p>

                    <img
                      src={resolveImageUrl(
                        booking.professionalInfo.passportPhoto
                      )}
                      alt="Passport"
                      className="h-32 w-24 object-cover border rounded"
                    />

                  </div>
                )}

                {booking.hostVerification?.verificationPhoto && (
                  <div className="text-center">

                    <p className="text-xs text-slate-400 mb-1">
                      Verification
                    </p>

                    <img
                      src={resolveImageUrl(
                        booking.hostVerification.verificationPhoto
                      )}
                      alt="Verification"
                      className="h-32 w-24 object-cover border rounded"
                    />

                  </div>
                )}

              </div>
            )}

            {/* Total */}
            <div className="border-t pt-6">

              <div className="flex justify-between text-2xl font-bold">

                <span>Total</span>

                <span>₹{totalAmount.toLocaleString()}</span>

              </div>

              <p className="text-xs text-slate-500 text-right mt-1">

                {quantity} × ₹{unitPrice.toLocaleString()} ×{" "}
                {booking.stayDuration || 1} month(s)

              </p>

            </div>

          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t no-print">

            <button
              onClick={onClose}
              className="px-5 py-2 border rounded-lg hover:bg-slate-100"
            >
              Close
            </button>

            <button
              onClick={printReceipt}
              className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Print Receipt
            </button>

          </div>

        </div>
      </div>
    </>
  );
};

export default ReceiptModal;