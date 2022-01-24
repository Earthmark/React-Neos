import fs from "fs";

export type RecordType = "world" | "object" | "audio" | "texture";

export interface NeosRecord {
    id: string,
    assetUri: string,
    globalVersion: number,
    localVersion: number,
    lastModifyingUserId: string,
    lastModifyingMachineId: string,
    name: string,
    description: string | null,
    recordType: RecordType,
    ownerName: string,
    tags: Array<string>,
    path: string | null,
    thumbnailUri: string,
    isPublic: boolean,
    isForPatrons: boolean,
    isListed: boolean,
    isDeleted: boolean,
    creationTime: string,
    firstPublishTime: string | null,
    lastModificationTime: string,
    randomOrder: number,
    visits: number,
    rating: number,
    submissions: null,
    neosDBassets: null,
    neosDBmanifest: Array<{
        hash: string,
        bytes: number
    }>,
    diffValidationTokens: [],
    type: 'Record',
    ownerId: 'U-Earthmark',
}

export function loadRecords(path: string): NeosRecord[] {
    const rawContent = fs.readFileSync(path).toString();
    return JSON.parse(rawContent) as NeosRecord[];
}
