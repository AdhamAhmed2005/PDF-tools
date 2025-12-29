import PaymentErrorClient from "@/features/payment/ui/PaymentErrorClient";

export const metadata = {
  title: "Payment Failed | PDF Tools",
  description: "We could not process your payment. Review common issues and try again.",
};

export default function PaymentErrorPage() {
  return <PaymentErrorClient />;
}
