export default function JobData({ type, formName, labelText, inputValue, isReadOnly, onChange }) {
    return (
        <div className="grid grid-cols-2 gap-x-2 items-center w-full">
            <label htmlFor={formName} className="text-1.7xl font-semibold text-left">{labelText}</label>
            <input
                type={type}
                name={formName}
                value={inputValue}
                readOnly={isReadOnly}
                onChange={onChange}
                className="pl-2 border rounded w-full md:w-64 justify-self-start"
            />
        </div>
    )
}
