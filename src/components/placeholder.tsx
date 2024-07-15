import React, { Suspense } from "react";
import { PageContext } from "../managers/page";
import Loader from "./loader";

export default function Placeholder(props: any) {
  const { page, name, ...restTopLevel } = props;
  const { components } = React.useContext(PageContext);
  const placeHolderProps = props.props;
  return (page.sublayouts || [])
    .filter((sl: { placeholder: string }) => sl.placeholder === name)
    .map((sl: { path: string; props: any }, i: number) => {
      const Component = components[sl.path];
      if (!Component) {
        throw `Sublayout ${sl.path} is missing`;
      }
      const rest = Object.assign(
        {},
        sl.props,
        page.values,
        placeHolderProps,
        restTopLevel,
      );

      return (
        <Suspense key={`sl-${name}-${i}`} fallback={<Loader />}>
          <Component {...rest} page={page} />
        </Suspense>
      );
    });
}
