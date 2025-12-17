import React from 'react';

const Textarea = React.forwardRef(({ 
  className = '',
  label,
  error,
  helperText,
  rows = 4,
  variant = 'default',
  ...props 
}, ref) => {
  const baseClasses = "w-full px-3 py-2 text-sm rounded-lg border transition-colors duration-200 focus:outline-none";
  
  const variants = {
    default: "bg-background text-foreground border-border focus:ring-2 focus:ring-primary/50 focus:border-primary hover:border-gray-400 dark:hover:border-gray-500",
    outlined: "bg-transparent border-border focus:border-primary",
    filled: "bg-muted/30 border-transparent focus:bg-background focus:border-primary"
  };

  const errorClasses = error 
    ? "border-destructive focus:ring-destructive/30" 
    : "";

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      
      <textarea
        ref={ref}
        rows={rows}
        className={`${baseClasses} ${variants[variant]} ${errorClasses} ${className}`}
        {...props}
      />
      
      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : helperText ? (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;