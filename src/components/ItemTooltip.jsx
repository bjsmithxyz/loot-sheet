import React from 'react';
import ItemIcon from './ItemIcon';
import TooltipContent from './TooltipContent';

export default function ItemTooltip({ item, className = '' }) {
    return (
        <div className={`item-tooltip-wow ${className}`.trim()}>
            <div className="item-tooltip-layout">
                <div className="item-tooltip-details">
                    <TooltipContent item={item} />
                </div>
                <ItemIcon item={item} size="large" className="item-tooltip-icon" />
            </div>
        </div>
    );
}
