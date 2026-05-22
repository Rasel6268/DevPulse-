export interface Issues {
  id?: number;
  title: string;
  description: string;
  type: "bug" | "feature_request";
}
