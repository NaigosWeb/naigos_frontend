import { computed, ref } from "vue";

export type PCTheme = "dark" | "cute";

// 像素混淆页的皮肤偏好：存在浏览器本地，不依赖登录态。
// 默认使用深色商务样式；用户切换后一直生效。
const STORAGE_KEY = "naigos.pixel-confusion.theme";

const theme = ref<PCTheme>("dark");

const isPCTheme = (value: unknown): value is PCTheme =>
    value === "dark" || value === "cute";

const readStoredTheme = (): PCTheme => {
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        return isPCTheme(stored) ? stored : "dark";
    } catch {
        return "dark";
    }
};

const applyTheme = (value: PCTheme) => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset.pcTheme = value;
};

const persistTheme = (value: PCTheme) => {
    try {
        window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
        // 隐私模式或存储被禁用时只影响记忆，不影响当前页面切换。
    }
};

let initialized = false;

export const initPCTheme = () => {
    theme.value = readStoredTheme();
    applyTheme(theme.value);
    if (initialized || typeof window === "undefined") return;
    initialized = true;
    // 多标签页之间保持同步
    window.addEventListener("storage", (event) => {
        if (event.key !== STORAGE_KEY) return;
        const next = isPCTheme(event.newValue) ? event.newValue : "dark";
        theme.value = next;
        applyTheme(next);
    });
};

if (typeof window !== "undefined") {
    theme.value = readStoredTheme();
    applyTheme(theme.value);
}

export const usePCTheme = () => {
    const isCute = computed(() => theme.value === "cute");

    const setTheme = (value: PCTheme) => {
        if (theme.value === value) return;
        theme.value = value;
        persistTheme(value);
        applyTheme(value);
    };

    const toggleTheme = () => {
        setTheme(theme.value === "cute" ? "dark" : "cute");
    };

    return { theme, isCute, setTheme, toggleTheme };
};
