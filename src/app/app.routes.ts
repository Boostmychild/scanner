import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "school-selection",
    pathMatch: "full",
  },
  {
    path: "school-selection",
    loadComponent: () =>
      import("./pages/school-selection/school-selection.page").then(
        (m) => m.SchoolSelectionPage,
      ),
  },
  {
    path: "home",
    loadComponent: () =>
      import("./pages/home/home.page").then((m) => m.HomePage),
  },
  {
    path: "camera-capture/:id",
    loadComponent: () =>
      import("./pages/camera-capture/camera-capture.page").then(
        (m) => m.CameraCapturePage,
      ),
  },
  {
    path: "**",
    redirectTo: "school-selection",
    pathMatch: "full",
  },
];
