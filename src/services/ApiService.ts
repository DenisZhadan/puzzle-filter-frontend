import type {App} from "vue";
import axios from "axios";
import type {AxiosRequestConfig, AxiosResponse} from "axios";
import VueAxios from "vue-axios";

/**
 * @description service to call HTTP request via Axios
 */
class ApiService {
    /**
     * @description property to share vue instance
     */
    public static vueInstance: App;

    /**
     * @description initialize vue axios
     */
    public static init(app: App<Element>) {
        ApiService.vueInstance = app;
        ApiService.vueInstance.use(VueAxios, axios);
        ApiService.vueInstance.axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;
        ApiService.setHeader();
    }

    /**
     * @description set the default HTTP request headers
     */
    public static setHeader(): void {
        ApiService.vueInstance.axios.defaults.headers.common["Accept"] = "application/json";
        ApiService.vueInstance.axios.defaults.headers.common["Content-Type"] = "application/json";
    }

    /**
     * @description send the GET HTTP request
     * @param url string
     * @param config AxiosRequestConfig
     * @returns Promise<AxiosResponse>
     */
    public static get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
        return ApiService.vueInstance.axios.get(url, config);
    }

    /**
     * @description set the POST HTTP request
     * @param url string
     * @param data any
     * @param config AxiosRequestConfig
     * @returns Promise<AxiosResponse>
     */
    public static post(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
        return ApiService.vueInstance.axios.post(url, data, config);
    }

    /**
     * @description send the PUT HTTP request
     * @param url string
     * @param data any
     * @param config AxiosRequestConfig
     * @returns Promise<AxiosResponse>
     */
    public static put(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
        return ApiService.vueInstance.axios.put(url, data, config);
    }

    /**
     * @description Send the DELETE HTTP request
     * @param url string
     * @param config AxiosRequestConfig
     * @returns Promise<AxiosResponse>
     */
    public static delete(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
        return ApiService.vueInstance.axios.delete(url, config);
    }
}

export default ApiService;
