import { Card } from "react-bootstrap";
import { 
  FaTrashAlt, 
  FaEdit, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaHourglassHalf,
  FaFlask,
  FaCheck
} from "react-icons/fa";
import PropTypes from 'prop-types';
import './CardNeeds.css';


export const CardNeeds = ({
  image,
  prescription_img,
  name,
  concentration,
  onRemove,
  examined,
  status,
  requested,
  goToRequestMedicine,
  goToUpdateRequest,
  isOrder = false,
}) => {
  const getStatusStyles = () => {
    if (examined) {
      if (status) {
        return isOrder 
          ? { class: 'status-accepted', text: 'Waiting to be affordable', icon: <FaCheckCircle className="status-icon" /> }
          : { class: 'status-accepted', text: 'Accepted', icon: <FaCheckCircle className="status-icon" /> };
      }
      return { class: 'status-rejected', text: 'Rejected', icon: <FaTimesCircle className="status-icon" /> };
    }
    return { class: 'status-pending', text: 'Pending', icon: <FaHourglassHalf className="status-icon" /> };
  };

  const statusInfo = getStatusStyles();

  return (
    <div className="needs-card-container">
      <Card className={`needs-card ${statusInfo.class}`}>
        {/* Image with status badge overlay */}
        <div className="needs-image-container">
          <img 
            src={image || prescription_img} 
            alt={name} 
            className="needs-image" 
          />
          <div className="needs-image-overlay"></div>
          
          {/* Status indicator - Always show status for examined items */}
          <div className="status-indicator">
            {statusInfo.icon}
            <span className="status-text">{statusInfo.text}</span>
          </div>
        </div>
        
        {/* Card content */}
        <div className="needs-content">
          <h3 className="needs-title">{name}</h3>
          
          <div className="needs-info-container">
            <div className="needs-info-item">
              <div className="needs-icon-wrapper">
                <FaFlask className="needs-icon" />
              </div>
              <div className="needs-info-content">
                <span className="needs-info-label">Concentration</span>
                <span className="needs-info-value">{isOrder ? "100mg" : concentration}</span>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="needs-actions">
            <button 
              className="needs-action-btn btn-delete" 
              onClick={onRemove}
              aria-label="Delete"
            >
              <FaTrashAlt />
            </button>
            
            {!requested && !examined && !status && (
              <button 
                className="needs-action-btn btn-checkout" 
                onClick={goToRequestMedicine}
                aria-label="Check out"
              >
                <FaCheck />
              </button>
            )}
            
            {!examined && requested && (
              <button 
                className="needs-action-btn btn-update" 
                onClick={goToUpdateRequest}
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
CardNeeds.propTypes = {
  image: PropTypes.string,
  prescription_img: PropTypes.string,
  name: PropTypes.string.isRequired,
  concentration: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  examined: PropTypes.bool,
  status: PropTypes.bool,
  requested: PropTypes.bool,
  goToRequestMedicine: PropTypes.func,
  goToUpdateRequest: PropTypes.func,
  isOrder: PropTypes.bool
};

CardNeeds.defaultProps = {
  examined: false,
  status: false,
  requested: false,
  goToRequestMedicine: () => {},
  goToUpdateRequest: () => {},
  isOrder: false
};
