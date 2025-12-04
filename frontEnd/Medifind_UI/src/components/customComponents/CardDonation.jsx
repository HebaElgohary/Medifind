import { Card } from "react-bootstrap";
import { 
  FaTrashAlt, 
  FaEdit, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaHourglassHalf,
  FaFlask,
  FaBoxes,
  FaRegClock
} from "react-icons/fa";
import PropTypes from 'prop-types';
import './CardDonation.css';

export const CardDonation = ({ image, name, quantity, pcs, expDate, onRemove, OnUpdate, examine, status }) => {
  // Status styling and indicators

console.log(expDate)
  const getStatusStyles = () => {
    if (examine) {
      return status ? 
        { class: 'status-accepted', text: 'Accepted', icon: <FaCheckCircle className="status-icon" /> } : 
        { class: 'status-rejected', text: 'Rejected', icon: <FaTimesCircle className="status-icon" /> };
    }
    return { class: 'status-pending', text: 'Pending', icon: <FaHourglassHalf className="status-icon" /> };
  };
  
  const statusInfo = getStatusStyles();

  return (
    <div className="donation-card-container">
      <Card className={`donation-card ${statusInfo.class}`}>
        {/* Image with status badge overlay */}
        <div className="donation-image-container">
          <img src={image} alt={name} className="donation-image" />
          <div className="donation-image-overlay"></div>
          
          {/* Status indicator */}
          <div className="status-indicator">
            {statusInfo.icon}
            <span className="status-text">{statusInfo.text}</span>
          </div>
        </div>
        
        {/* Card content */}
        <div className="donation-content">
          <h3 className="donation-title">{name}</h3>
          
          <div className="donation-info-container">
            <div className="donation-info-item">
              <div className="donation-icon-wrapper">
                <FaFlask className="donation-icon" />
              </div>
              <div className="donation-info-content">
                <span className="donation-info-label">Concent</span>
                <span className="donation-info-value">{quantity}</span>
              </div>
            </div>
            
            <div className="donation-info-divider me-3"></div>
            
            <div className="donation-info-item">
              <div className="donation-icon-wrapper">
                <FaBoxes className="donation-icon" />
              </div>
              <div className="donation-info-content">
                <span className="donation-info-label">Pieces</span> 
                <span className="donation-info-value">{pcs}</span>
              </div>
            </div>
          </div>
          
          <div className="donation-expiry">
            <div className="expiry-icon-wrapper">
              <FaRegClock className="expiry-icon" />
            </div>
            <div className="expiry-content">
              <span className="expiry-label">Expires on</span>
              <span className="expiry-date">{expDate.split("-").slice(0,2).join("-")}</span>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="donation-actions">
            <button 
              className="donation-action-btn btn-delete" 
              onClick={onRemove}
              aria-label="Delete"
            >
              <FaTrashAlt />
            </button>
            
            {!examine && (
              <button 
                className="donation-action-btn btn-update" 
                onClick={OnUpdate}
                aria-label="Update"
              >
                <FaEdit />
              </button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

// PropTypes for component validation
CardDonation.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  quantity: PropTypes.string.isRequired,
  pcs: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  expDate: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  OnUpdate: PropTypes.func,
  examine: PropTypes.bool,
  status: PropTypes.bool
};

CardDonation.defaultProps = {
  examine: false,
  status: false,
  OnUpdate: () => {}
};
