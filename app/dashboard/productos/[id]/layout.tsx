
export default function Layout({
    sheet,
    children,
}: {
    sheet: React.ReactNode
    children: React.ReactNode
}) {
    return (
        <>
            {children}
            {sheet}
        </>
    )
}