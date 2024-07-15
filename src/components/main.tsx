export default function MainLayout(props: any) {
  return (
    <div>
      <h1>{"Main Layout"}</h1>
      {props.children}
    </div>
  );
}
