import React from "react";

import './NumberDisplay.css'
import { NumberDisplayType } from "../types/types";

export const NumberDisplay: React.FC<NumberDisplayType> = ({ value }) => {
    return <div className='number-display'>{value.toString().padStart(3, '0')}</div>
};