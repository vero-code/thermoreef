export type ModeTab = 'mock' | 'custom' | 'dev';

export type SettingsPanelProps = {
  mode: ModeTab;
  onModeChange: (mode: ModeTab) => void;
  onClose: () => void;
};

export type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: ModeTab;
  onModeChange: (mode: ModeTab) => void;
};

export type ModeSelectorProps = {
  activeTab: ModeTab;
  onSelectTab: (tab: ModeTab) => void;
};

export type LiveCloudTabProps = {
  nebiusKey: string;
  tavilyKey: string;
  nebiusInvalid: boolean;
  tavilyInvalid: boolean;
  onNebiusChange: (val: string) => void;
  onTavilyChange: (val: string) => void;
};

export type DevTabProps = {
  devInvalid: boolean;
  devError: string | null;
};
