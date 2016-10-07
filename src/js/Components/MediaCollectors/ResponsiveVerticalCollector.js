/**
 * Created by PedroGaspar on 04/10/2016.
 */

import React from 'react';
const ResponsiveVerticalCollector = (props) => {
    const Box = props.box;
    return (
        <div className="collector responsive-vertical-collector">
        {
            props.medias.map( (data, index) => {
                return (
                    <Box
                        {...props}
                        media={data}
                        key={"m" + data._id}
                    />
                )
            })
        }
        </div>
    )
}

export default ResponsiveVerticalCollector;