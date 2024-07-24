import { Suspense } from "react";
import Loader from "../controls/loader";
import { usePartonUIConfig } from "../managers/config";

export default function Placeholder(props: any) {
  const { page, name, ...restTopLevel } = props;
  const { sublayouts: components } = usePartonUIConfig();
  const placeHolderProps = props.props;
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
