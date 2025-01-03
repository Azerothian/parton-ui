import React, { Suspense } from "react";
import Loader from "../controls/loader";
import { usePartonUIConfig } from "../managers/config";
import { usePage } from "../managers/page";

export default function Placeholder(props: any) {
  const { name, ...restTopLevel } = props;
  const { sublayouts: components } = usePartonUIConfig();
  const { page } = usePage();
  const placeHolderProps = props.props;
  if (!page) {
    return <React.Fragment />;
  }

  return (page.sublayouts || [])
    .filter((sl: { placeholder: string }) => sl.placeholder === name)
    .map((sl: { path: string; props: any }, i: number) => {
      const Component = components[sl.path];
      if (!Component) {
        throw `Components ${sl.path} is missing`;
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
