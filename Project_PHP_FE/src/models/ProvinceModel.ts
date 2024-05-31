export interface Province {
    province_id: string;
    province_name: string;
    province_type: string;
}

export interface ProvinceResponse {
    results: Province[];
}

export interface District {
    district_id: string;
    district_name: string;
    district_type: string;
    lat: number | null;
    lng: number | null;
    province_id: string;
}

export interface DistrictResponse {
    results: District[];
}

export interface Ward {
    district_id: string;
    ward_id: string;
    ward_name: string;
    ward_type: string;
}

export interface WardResponse {
    results: Ward[];
}
