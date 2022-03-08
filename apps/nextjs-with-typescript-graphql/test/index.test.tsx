import { InMemoryCache, gql } from "@apollo/client";
import React from "react";
import Index from "../pages";
import renderer, { act } from "react-test-renderer";
import { MockedProvider } from "@apollo/client/testing";

// Refactor cache example to a shared resource
const cache = new InMemoryCache();
cache.writeQuery({
  query: gql`
    query Viewer {
      viewer {
        id
        name
        status
      }
    }
  `,
  data: {
    viewer: {
      __typename: "User",
      id: "Baa",
      name: "Baa",
      status: "Healthy",
    },
  },
});

describe("Page - Index [DEFAULT]", () => {
  it("matches the initially rendered snapshot", () => {
    const component = renderer.create(
      <MockedProvider cache={cache}>
        <Index />
      </MockedProvider>
    );

    expect(component.toJSON()).toMatchSnapshot();
  });

  it("matches the fully rendered snapshot", async () => {
    const component = renderer.create(
      <MockedProvider cache={cache}>
        <Index />
      </MockedProvider>
    );

    // Fire off async events to cause the component to change here
    await act(() => {
      return new Promise((resolve) => {
        // Simulate waiting for the GraphQL query response to populate our cache by waiting 10ms
        setTimeout(() => resolve(), 10);
      });
    });

    // Test the final state of our component
    expect(component.toJSON()).toMatchSnapshot();
  });
});
