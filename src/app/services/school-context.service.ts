import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

export interface SchoolContext {
  serviceProviderId: number;
  schoolId: number;
}

@Injectable({
  providedIn: "root",
})
export class SchoolContextService {
  private readonly STORAGE_KEY = "school_context";
  private contextSubject = new BehaviorSubject<SchoolContext | null>(
    this.loadContextFromStorage()
  );
  public context$: Observable<SchoolContext | null> =
    this.contextSubject.asObservable();

  constructor() {}

  setContext(serviceProviderId: number, schoolId: number): void {
    const context: SchoolContext = {
      serviceProviderId,
      schoolId,
    };
    this.saveContextToStorage(context);
    this.contextSubject.next(context);
  }

  getContext(): SchoolContext | null {
    return this.loadContextFromStorage();
  }

  clearContext(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.contextSubject.next(null);
  }

  hasContext(): boolean {
    const context = this.getContext();
    return context !== null && 
           typeof context.serviceProviderId === 'number' && 
           typeof context.schoolId === 'number';
  }

  private saveContextToStorage(context: SchoolContext): void {
    try {
      const serialized = JSON.stringify(context);
      localStorage.setItem(this.STORAGE_KEY, serialized);
    } catch (error) {
      console.error("Failed to save school context to localStorage:", error);
    }
  }

  private loadContextFromStorage(): SchoolContext | null {
    try {
      const serialized = localStorage.getItem(this.STORAGE_KEY);
      if (!serialized) {
        return null;
      }
      const context = JSON.parse(serialized);
      // Validate the structure
      if (
        context &&
        typeof context.serviceProviderId === "number" &&
        typeof context.schoolId === "number"
      ) {
        return context;
      }
      return null;
    } catch (error) {
      console.error("Failed to load school context from localStorage:", error);
      return null;
    }
  }
}
