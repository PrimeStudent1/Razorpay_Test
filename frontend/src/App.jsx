import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductShowcase, { ROOMS_DATA } from './components/ProductShowcase';
import FeaturesSection from './components/FeaturesSection';
import ComparisonSection from './components/ComparisonSection';
import GallerySection from './components/GallerySection';
import TrustSection from './components/TrustSection';
import ContactSection from './components/ContactSection';
import MobileStickyBar from './components/MobileStickyBar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import {
  getGatewayConfig,
  createProductOrder,
  verifyPaymentSignature,
} from './services/paymentApi';
import { TEJUS_LOGO_DATA_URL } from './services/logoDataUrl';

// Lazy-loaded routes & heavy components for instant initial page rendering
const PaymentPage = lazy(() => import('./components/PaymentPage'));
const RoomAllotmentPage = lazy(() => import('./components/room-allotment/RoomAllotmentPage'));
const CheckoutModal = lazy(() => import('./components/CheckoutModal'));
const OrderSuccessModal = lazy(() => import('./components/OrderSuccessModal'));

/**
 * Sleek luxury loading fallback for lazy-loaded routes
 */
function RouteLoadingFallback({ message = 'Loading Tejus Boys PG...' }) {
  return (
    <div className="lazy-route-loader">
      <div className="spinner-glow"></div>
      <p>{message}</p>
    </div>
  );
}

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
  // 1. Dedicated route check for Room Allotment Form
  const isAllotmentRoute =
    window.location.pathname === '/room-allotment-form' ||
    window.location.pathname === '/admin/room-allotment-form' ||
    new URLSearchParams(window.location.search).get('page') === 'room-allotment-form' ||
    new URLSearchParams(window.location.search).get('tab') === 'allotment';

  if (isAllotmentRoute) {
    return (
      <Suspense fallback={<RouteLoadingFallback message="Loading Room Allotment Portal..." />}>
        <RoomAllotmentPage />
      </Suspense>
    );
  }

  // 2. Dedicated route check for Next Tab checkout portal
  const isCheckoutRoute =
    window.location.pathname === '/checkout' ||
    new URLSearchParams(window.location.search).get('page') === 'checkout' ||
    (new URLSearchParams(window.location.search).has('orderId') && !new URLSearchParams(window.location.search).has('payment_status'));

  if (isCheckoutRoute) {
    return (
      <Suspense fallback={<RouteLoadingFallback message="Connecting to Secure Checkout..." />}>
        <PaymentPage />
      </Suspense>
    );
  }

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

  // Listen for payment completion from Next Tab via BroadcastChannel, storage event & postMessage
  useEffect(() => {
    let bc;
    try {
      if (window.BroadcastChannel) {
        bc = new BroadcastChannel('tejus_pg_payments');
        bc.onmessage = (event) => {
          if (event.data && event.data.success) {
            setIsBookingModalOpen(false);
            setPaymentResult(event.data);
          }
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel sync init:', e);
    }

    const handleStorage = (e) => {
      if (e.key === 'tejus_last_payment' && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          if (data && data.success) {
            setIsBookingModalOpen(false);
            setPaymentResult(data);
          }
        } catch (err) {
          console.warn('Storage sync error:', err);
        }
      }
    };
    window.addEventListener('storage', handleStorage);

    const handleMessage = (e) => {
      if (e.data && e.data.type === 'TEJUS_PAYMENT_SUCCESS') {
        setIsBookingModalOpen(false);
        setPaymentResult(e.data.data);
      }
    };
    window.addEventListener('message', handleMessage);

    return () => {
      if (bc) bc.close();
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('message', handleMessage);
    };
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

  // Primary Payment Execution Flow via Razorpay (Supports Next Tab and Modal flows)
  const handleProceedToPayment = useCallback(async (openInNewTab = true, targetTab = null) => {
    setErrorMessage('');
    setIsProcessing(true);

    try {
      // Determine product ID for backend server-side price calculation
      const orderProductId = bookingPlan === 'token' ? selectedRoom.tokenId : selectedRoom.id;

      // 1. Initialize Order on Backend
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

      // 2. Next Tab Checkout Flow
      if (openInNewTab) {
        // Save order data for next-tab fallback
        try {
          sessionStorage.setItem('tejus_pay_orderId', orderData.orderId);
          sessionStorage.setItem('tejus_pay_keyId', orderData.keyId);
          sessionStorage.setItem('tejus_pay_amount', String(orderData.amount));
          sessionStorage.setItem('tejus_pay_amountInRupees', String(orderData.amountInRupees));
          sessionStorage.setItem('tejus_pay_room', selectedRoom.title);
          sessionStorage.setItem('tejus_pay_plan', planLabel);
          sessionStorage.setItem('tejus_pay_name', customer.name);
          sessionStorage.setItem('tejus_pay_email', customer.email);
          sessionStorage.setItem('tejus_pay_phone', customer.phone);
          sessionStorage.setItem('tejus_pay_date', moveInDetails.moveInDate);
        } catch (storageErr) {
          console.warn('Session storage warning:', storageErr);
        }

        const checkoutUrl = `/checkout?orderId=${encodeURIComponent(orderData.orderId)}&keyId=${encodeURIComponent(orderData.keyId)}&amount=${encodeURIComponent(orderData.amount)}&amountInRupees=${encodeURIComponent(orderData.amountInRupees)}&room=${encodeURIComponent(selectedRoom.title)}&plan=${encodeURIComponent(planLabel)}&name=${encodeURIComponent(customer.name)}&email=${encodeURIComponent(customer.email)}&phone=${encodeURIComponent(customer.phone)}&date=${encodeURIComponent(moveInDetails.moveInDate)}`;

        if (targetTab && !targetTab.closed) {
          targetTab.location.href = checkoutUrl;
        } else {
          window.open(checkoutUrl, '_blank');
        }

        setIsProcessing(false);
        return;
      }

      // 3. Fallback: In-page Razorpay Checkout modal
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Payment gateway SDK failed to load. Please check your connection.');
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'TEJUS BOYS PG',
        description: `${selectedRoom.title} (${planLabel})`,
        image: TEJUS_LOGO_DATA_URL,
        order_id: orderData.orderId,
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.phone,
        },
        theme: {
          color: '#18181b',
        },
        handler: async function (response) {
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
      if (targetTab && !targetTab.closed) {
        targetTab.close();
      }
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

      {/* Interactive Visit Schedule & Direct Contact */}
      <ContactSection onOpenBooking={() => setIsBookingModalOpen(true)} />

      {/* Footer */}
      <Footer
        onScrollToSection={handleScrollToSection}
        onOpenBooking={() => setIsBookingModalOpen(true)}
      />

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />

      {/* Mobile Sticky Action Bar */}
      <MobileStickyBar
        onOpenBooking={() => setIsBookingModalOpen(true)}
        isModalOpen={isBookingModalOpen || Boolean(paymentResult)}
      />

      {/* Room Reservation Checkout Modal */}
      {isBookingModalOpen && (
        <Suspense fallback={null}>
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
        </Suspense>
      )}

      {/* Official Booking Confirmation Pass Modal */}
      {paymentResult && (
        <Suspense fallback={null}>
          <OrderSuccessModal
            result={paymentResult}
            onClose={() => setPaymentResult(null)}
            onRetry={() => {
              setPaymentResult(null);
              setIsBookingModalOpen(true);
            }}
          />
        </Suspense>
      )}
    </div>
  );
}