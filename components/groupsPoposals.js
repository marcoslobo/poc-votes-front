export default function GroupsPoposals(props) {
  console.log("pppsss", props);
  if (props.proposals != undefined) {
    console.log("he");
    return props.proposals.map((group) => {
      <div>
        <h1>{group.title}</h1>
      </div>;
    });
  } else return <></>;
  // return props.proposals.map((group) => {
  //   <div>
  //     <h1>group.title</h1>
  //   </div>;
  // });
}
