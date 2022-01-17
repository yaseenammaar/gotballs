const Button = ({ children, className, ...rest }) => (
  <button
    {...rest}
    className={`px-4 py-2 text-sm text-white transition-all duration-300  rounded-md bg-primary hover:shadow-lg shadow-sm ${className}`}
  >
    {children}
  </button>
);

export default Button;
