import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductShowcase, { ROOMS_DATA } from './components/ProductShowcase';
import FeaturesSection from './components/FeaturesSection';
import ComparisonSection from './components/ComparisonSection';
import GallerySection from './components/GallerySection';
import TrustSection from './components/TrustSection';
import Footer from './components/Footer';
import CheckoutModal from './components/CheckoutModal';
import OrderSuccessModal from './components/OrderSuccessModal';
import WhatsAppButton from './components/WhatsAppButton';
import {
  getGatewayConfig,
  createProductOrder,
  verifyPaymentSignature,
} from './services/paymentApi';

/**
 * Dynamically loads Razorpay checkout.js script
 */
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function App() {
  // Room & Booking State
  const [selectedRoom, setSelectedRoom] = useState(ROOMS_DATA[2]); // 2-Share AC default
  const [bookingPlan, setBookingPlan] = useState('token'); // 'token' or 'rent'
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Resident & Move-in Details
  const [customer, setCustomer] = useState({
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '9876543210',
  });

  const [moveInDetails, setMoveInDetails] = useState({
    moveInDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    foodPreference: 'both',
    occupation: 'Graphic Era Student',
  });

  // Gateway Config & Processing State
  const [config, setConfig] = useState({
    keyId: '',
    maskedKeyId: '',
    isConfigured: false,
    isTestMode: false,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentResult, setPaymentResult] = useState(null);

  // Fetch Gateway Configuration on Mount
  useEffect(() => {
    getGatewayConfig()
      .then((cfg) => setConfig(cfg))
      .catch((err) => console.warn('Gateway config error:', err.message));
    loadRazorpayScript();
  }, []);

  // Smooth scroll helper
  const handleScrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Trigger booking modal for specific room
  const handleSelectRoomForBooking = (room, plan = 'token') => {
    setSelectedRoom(room);
    setBookingPlan(plan);
    setIsBookingModalOpen(true);
  };

  // Primary Payment Execution Flow via Razorpay
  const handleProceedToPayment = useCallback(async () => {
    setErrorMessage('');
    setIsProcessing(true);

    try {
      // 1. Ensure Razorpay SDK script is ready
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Payment gateway SDK failed to load. Please check your connection.');
      }

      // Determine product ID for backend server-side price calculation
      const orderProductId = bookingPlan === 'token' ? selectedRoom.tokenId : selectedRoom.id;

      // 2. Initialize Order on Backend
      const orderData = await createProductOrder({
        productId: orderProductId,
        quantity: 1,
        customer,
        shippingAddress: {
          city: 'Dehradun, Uttarakhand',
          moveInDate: moveInDetails.moveInDate,
          foodPreference: moveInDetails.foodPreference,
          occupation: moveInDetails.occupation,
        },
      });

      const planLabel = bookingPlan === 'token' ? 'Bed Reservation Token' : '1st Month Rent';

      // 3. Configure Razorpay Checkout modal with TEJAS PG branding
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'TEJUS PG',
        description: `${selectedRoom.title} (${planLabel})`,
        image: `${window.location.origin}/tejus-logo.png`,
        order_id: orderData.orderId,
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.phone,
        },
        theme: {
          color: '#18181b', // Clean luxury dark brand color matching theme
        },
        handler: async function (response) {
          // 4. Verify signature on backend
          try {
            const verifyRes = await verifyPaymentSignature({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: orderData.amountInRupees,
              orderData: {
                productName: `${selectedRoom.title} (${planLabel})`,
                quantity: 1,
              },
            });

            setIsBookingModalOpen(false);
            setPaymentResult({
              success: true,
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              amount: orderData.amountInRupees,
              productName: `${selectedRoom.title} (${planLabel})`,
              residentName: customer.name,
              moveInDate: moveInDetails.moveInDate,
              verifiedAt: verifyRes.verifiedAt,
            });
          } catch (verifyErr) {
            setPaymentResult({
              success: false,
              orderId: response.razorpay_order_id,
              error: verifyErr.message || 'Payment signature verification failed',
            });
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      // 5. Open Razorpay Checkout modal
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        setPaymentResult({
          success: false,
          orderId: orderData.orderId,
          error: resp.error?.description || 'Payment was cancelled or declined',
        });
        setIsProcessing(false);
      });

      rzp.open();
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred during booking initialization');
      setIsProcessing(false);
    }
  }, [selectedRoom, bookingPlan, customer, moveInDetails]);

  return (
    <div className="tejas-site-wrapper">
      {/* Top Navbar */}
      <Navbar
        onOpenBooking={() => setIsBookingModalOpen(true)}
        onScrollToSection={handleScrollToSection}
      />

      {/* Hero Section */}
      <Hero
        onExploreRooms={() => handleScrollToSection('rooms')}
        onOpenBooking={() => setIsBookingModalOpen(true)}
      />

      {/* Room Types Showcase (Screenshot 3 & 4) */}
      <ProductShowcase
        onSelectRoomForBooking={handleSelectRoomForBooking}
      />

      {/* 12-Card Amenities & Features (Screenshot 2) */}
      <FeaturesSection />

      {/* The Tejas Difference Comparison Table & Black Stats Banner (Screenshot 1) */}
      <ComparisonSection />

      {/* Virtual Photo Tour (Screenshot 5) */}
      <GallerySection />

      {/* Location Proximity & FAQ */}
      <TrustSection />

      {/* Footer */}
      <Footer
        onScrollToSection={handleScrollToSection}
        onOpenBooking={() => setIsBookingModalOpen(true)}
      />

      {/* Floating WhatsApp Button (Screenshot 4) */}
      <WhatsAppButton />

      {/* Room Reservation Checkout Modal */}
      <CheckoutModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        selectedRoom={selectedRoom}
        setSelectedRoom={setSelectedRoom}
        bookingPlan={bookingPlan}
        setBookingPlan={setBookingPlan}
        customer={customer}
        setCustomer={setCustomer}
        moveInDetails={moveInDetails}
        setMoveInDetails={setMoveInDetails}
        onProceedToPayment={handleProceedToPayment}
        isProcessing={isProcessing}
        errorMessage={errorMessage}
      />

      {/* Official Booking Confirmation Pass Modal */}
      <OrderSuccessModal
        result={paymentResult}
        onClose={() => setPaymentResult(null)}
        onRetry={() => {
          setPaymentResult(null);
          setIsBookingModalOpen(true);
        }}
      />
    </div>
  );
}
