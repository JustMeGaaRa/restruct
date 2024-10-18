import { FC } from "react";
import { MarkerType } from "./MarkerType";

export const MarkerArrowClosed: FC<{
    fill?: string;
    stroke?: string;
}> = ({
    fill = "#8A8B8C",
    stroke = "#8A8B8C"
}) => {
        // TODO: fix edge marker alignment
        return (
            <marker
                id={MarkerType.ArrowClosed}
                markerHeight={"6.5"}
                markerWidth={"6"}
                refX={"6"}
                refY={"6.5"}
                viewBox={"0 0 12 13"}
                fill={"none"}
                orient={"auto"}
            >
                <path
                    d="M2.60852 2.3426L9.61252 6.2826C9.65099 6.30441 9.683 6.33603 9.70526 6.37424C9.72753 6.41245 9.73926 6.45588 9.73926 6.5001C9.73926 6.54433 9.72753 6.58776 9.70526 6.62597C9.683 6.66418 9.65099 6.6958 9.61252 6.7176L2.60852 10.6576C2.56362 10.6827 2.51208 10.6933 2.46093 10.688C2.40978 10.6827 2.36151 10.6617 2.3227 10.628C2.28388 10.5943 2.25641 10.5494 2.24403 10.4995C2.23166 10.4496 2.23497 10.3971 2.25352 10.3491L3.71452 6.5906C3.73713 6.53239 3.73713 6.46782 3.71452 6.4096L2.25302 2.6511C2.23436 2.60308 2.23099 2.55047 2.24337 2.50046C2.25575 2.45046 2.28328 2.4055 2.32219 2.37173C2.3611 2.33796 2.40949 2.31704 2.46074 2.31183C2.512 2.30662 2.56361 2.31736 2.60852 2.3426Z"
                    fill={fill}
                    stroke={stroke}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </marker>
        )
    }