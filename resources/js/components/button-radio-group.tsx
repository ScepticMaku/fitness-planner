import React from 'react';

const ButtonRadioGroup = ({
    options,
    selectedValue,
    onValueChange,
    name,
    className = ""
}) => {
    return (
        <div className={`btn-group ${className}`} role="group">
            {options.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    className={`btn ${selectedValue === option.value
                            ? 'btn-primary active'
                            : 'btn-outline-primary'
                        }`}
                    onClick={() => onValueChange(option.value)}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};

export default ButtonRadioGroup;
