export default function UserProfileData({ type, formName, labelText, inputValue, isReadOnly = true, isError = false, errorMessage, onChange }) {
   return (
      <div className="flex flex-col w-full">
         <label htmlFor={type} className="font-semibold">
            {labelText}
         </label>
         <input
            type={type}
            name={formName}
            value={inputValue}
            readOnly={isReadOnly}
            onChange={onChange}
            className={`pl-2 h-8 border rounded ${isError && "border-red-500"}`}
         />
         {!isReadOnly && isError && <p className="pl-1 text-red-500 text-xs">{errorMessage}</p>}
      </div>
   )
}
