

export const ErrorMessage = ({ error }: { error: string }) => {
    return (
        <div className="text-red-500 text-sm font-semibold">
            <p>{error}</p>
        </div>
    )
}