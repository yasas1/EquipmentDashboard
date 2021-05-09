import { OperationalStatus } from "./OperationalStatus";

export default interface EquipmentProperty {

    AssetID:string;
    AssetCategoryID:string;
    __rowid__:string;
    OperationalStatus:OperationalStatus;
    Description:string;

}