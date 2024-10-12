/**
 * Oryboard API
 * 1.0.0
 * DO NOT MODIFY - This file has been generated using oazapfts.
 * See https://www.npmjs.com/package/oazapfts
 */
import * as Oazapfts from "@oazapfts/runtime";
import * as QS from "@oazapfts/runtime/query";
export const defaults: Oazapfts.Defaults<Oazapfts.CustomHeaders> = {
    headers: {},
    baseUrl: "https://oryboard.internal",
};
const oazapfts = Oazapfts.runtime(defaults);
export const servers = {
    server1: "https://oryboard.internal"
};
export type GetStatisticsResponse = {
    count_identities: number;
    count_hydra_clients: number;
};
export type Error = {
    code: number;
    message: string;
};
export type Identity = {
    account_id: string;
};
export type ListIdentitiesResponse = {
    items: Identity[];
};
export type ListOAuthClientsResponse = {
    client_id: string;
};
/**
 * Get statistics.
 */
export function getStatistics(opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: GetStatisticsResponse;
    } | {
        status: number;
        data: Error;
    }>("/stats", {
        ...opts
    });
}
export function listIdentities(opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: ListIdentitiesResponse;
    } | {
        status: number;
        data: Error;
    }>("/identities", {
        ...opts
    });
}
export function listOAuthClients(opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: ListOAuthClientsResponse;
    } | {
        status: number;
        data: Error;
    }>("/oauth/clients", {
        ...opts
    });
}
