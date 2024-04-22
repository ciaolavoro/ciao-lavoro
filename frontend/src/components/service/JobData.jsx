export default function JobData({ type, formName, labelText, inputValue, isReadOnly, onChange, renderAsText }) {
    return (
        <div className="flex flex-col justify-center gap-y-6 px-8 py-3">
            <label htmlFor={formName} className="flex flex-col gap-x-4 text-1.7xl font-semibold">{labelText}</label>
            {renderAsText ? (
                <span>{inputValue}</span>
            ) : (
                <input
                    type={type}
                    name={formName}
                    value={inputValue}
                    readOnly={isReadOnly}
                    onChange={onChange}
                    className="pl-2 border rounded w-full h-auto mx-1 justify-self-start sm:w-full lg:w-auto"
                />
            )}
        </div>
    )
}
