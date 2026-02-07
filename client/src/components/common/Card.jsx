import PropTypes from 'prop-types';

const Card = ({ 
  children, 
  className = '',
  padding = 'normal',
  hover = false 
}) => {
  const paddingClasses = {
    none: '',
    small: 'p-4',
    normal: 'p-6',
    large: 'p-8',
  };

  const hoverClass = hover ? 'hover:shadow-card-hover cursor-pointer' : '';

  return (
    <div 
      className={`
        bg-white rounded-lg shadow-card 
        ${paddingClasses[padding]} 
        ${hoverClass}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  padding: PropTypes.oneOf(['none', 'small', 'normal', 'large']),
  hover: PropTypes.bool,
};

export default Card;