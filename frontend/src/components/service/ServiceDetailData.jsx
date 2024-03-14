export default function ServiceDetailsData({ type, formName, labelText, inputValue, isReadOnly, onChange }) {
    return (
        <div className="flex flex-col w-full">
            <label htmlFor={formName} className="font-semibold">{labelText}</label>
            <input
                type={type}
                name={formName}
                value={inputValue}
                readOnly={isReadOnly}
                onChange={onChange}
                className="pl-2 border rounded"
            />
        </div>
    )
}