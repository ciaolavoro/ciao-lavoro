export default function ServiceDetailsData({ type, formName, labelText, inputValue, isReadOnly, isError, errorMessage,onChange }) {
    return (
        <div className="flex flex-col gap-x-4">
            <label htmlFor={formName} className="font-semibold">{labelText}</label>
            <input type={type} name={formName} value={inputValue} readOnly={isReadOnly} onChange={onChange} className={`w-full pl-2 border rounded ${isError && "border-red-500"}`}/>
        {!isReadOnly && isError && <p className="pl-1 text-red-500 text-xs">{errorMessage}</p>}
        </div>
    )
}