import { createSkeletonProvider, createSkeletonElement } from './node_modules/@trainline/react-skeletor';
import "./Skeleton.scss";

const navButton = createSkeletonElement("div");

const sideBar = ({button}) => {
    <div>
        <navButton />
        <navButton />
        <navButton />
        <navButton />
        <br/> 
        <navButton />
        <navButton />
    </div>
};

export default createSkeletonProvider(

)(sideBar);