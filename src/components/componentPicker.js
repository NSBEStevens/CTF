


function Display(props) {
        return (
                <div className="components">
                        {props.info[props.page].component}
                </div>
        );
}

export { Display }