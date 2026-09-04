import React from 'react';

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/917009343535?text=Hi%20Tejas%20PG%2C%20I%20am%20interested%20in%20room%20booking%20details."
      target="_blank"
      rel="noopener noreferrer"
      className="floating-whatsapp-btn"
      title="Chat with Tejas PG Warden & Admissions on WhatsApp"
    >
      <div className="whatsapp-icon-bubble">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.967.534 1.771.82 2.796.821 3.183 0 5.77-2.586 5.77-5.766.001-3.18-2.585-5.808-5.77-5.808zm0-2.172c4.398 0 7.969 3.568 7.969 7.973 0 4.403-3.571 7.973-7.969 7.973-1.353 0-2.657-.34-3.805-.986l-4.226 1.107 1.132-4.133c-.732-1.206-1.12-2.6-1.12-4.004 0-4.405 3.57-7.973 7.969-7.973zm0 2.47c-3.039 0-5.503 2.464-5.503 5.503 0 1.218.396 2.348 1.066 3.264l-.659 2.408 2.469-.648c.883.585 1.936.93 3.069.93 3.039 0 5.503-2.464 5.503-5.503 0-3.039-2.464-5.503-5.503-5.503z" />
        </svg>
      </div>
      <span className="whatsapp-txt">Chat on WhatsApp</span>
    </a>
  );
}
