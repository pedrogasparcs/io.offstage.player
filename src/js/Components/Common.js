/**
 * Created by PedroGaspar on 04/10/2016.
 */

import React from 'react';
import {Order, TypeFilter} from '../CustomTypes';

export const Loading = (props) => {
    if(props.visible) {
        return (
            <div className="loading fb-loader"><div></div><div></div><div></div></div>
        );
    }
    return <div/>;
};

const TypeFilterBar = (props) => {
    return (
        <div className="type-filter filter">
            <ul className="filter-options">
                <li onClick={() => props.onSelect(TypeFilter.ALL)} className={props.current == TypeFilter.ALL?"active":""}>All</li>
                <li onClick={() => props.onSelect(TypeFilter.PHOTOS)} className={props.current == TypeFilter.PHOTOS?"active":""}>Photos</li>
                <li onClick={() => props.onSelect(TypeFilter.VIDEOS)} className={props.current == TypeFilter.VIDEOS?"active":""}>Videos</li>
            </ul>
        </div>
    )
}

const SortBar = (props) => {
    return (
        <div className="sort-filter filter">
            <ul className="filter-options">
                <li onClick={() => props.onSelect(Order.TIME)} className={props.current == Order.TIME?"active":""}>Most recent</li>
                <li onClick={() => props.onSelect(Order.TIME_ASC)} className={props.current == Order.TIME_ASC?"active":""}>Oldest</li>
                <li onClick={() => props.onSelect(Order.ENGAGE)} className={props.current == Order.ENGAGE?"active":""}>Most engaged</li>
                <li onClick={() => props.onSelect(Order.LIKES)} className={props.current == Order.LIKES?"active":""}>Most liked</li>
                <li onClick={() => props.onSelect(Order.COMMENTS)} className={props.current == Order.COMMENTS?"active":""}>Most commented</li>
            </ul>
        </div>
    )
}

export const FilterBar = (props) => {
    return (
        <div className="filter-bar">
            <div className="container">
                <TypeFilterBar current={props.typeFilter} onSelect={(value) => props.onSelect(TypeFilter, value)}/>
                <SortBar current={props.order} onSelect={(value) => props.onSelect(Order, value)}/>
            </div>
        </div>
    )
}