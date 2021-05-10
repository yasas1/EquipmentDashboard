import { OperationalStatus } from "./OperationalStatus";

export default interface EquipmentProperty {

    AssetID:string;
    AssetCategoryID:string;
    AssetCategoryKey:string;
    __rowid__:string;
    OperationalStatus:OperationalStatus;
    Description:string;
    InstalledLocationKey:string;
    Model:string;
    SerialNumber:string;
    BarCode:string;
    InstalledDate:string;
    Ownership:string;
    CommissionedDate:string;
    AssetKey:string;
    ObjectID:string;
    InstalledLocationName:string;

}