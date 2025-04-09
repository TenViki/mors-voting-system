"use client";

export class ErrorResponse {
  constructor(public fieldErrors: Record<string, string>) {}
}
