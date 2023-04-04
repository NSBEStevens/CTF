


function Display(props) {
        return (
                <div className="components">
                        {props.info[props.component].component}
                </div>
        );
}

export { Display }