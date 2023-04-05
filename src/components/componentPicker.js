


function Display(props) {
        return (
                <div className="components">
                        {props.info[props.component > 0? props.component: 0].component}
                </div>
        );
}

export { Display }