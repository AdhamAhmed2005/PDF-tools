const ToolPage = async ({params}) => {
    const resolvedParams = await params;

    return(
        <div>
            {resolvedParams.tool}
        </div>
    )


}

export default ToolPage