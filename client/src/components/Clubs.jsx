import { useEffect, useState } from "react";

const Clubs = ({ email }) => {

  const [ isMember, setIsMember ] = useState([]);
  const [ rsoList, setRsoList ] = useState([]);
  
  
  async function getClubs() {
    const res = await fetch(`http://localhost:5000/rso_member/${email}`);

    const result = await res.json();

    console.log('getClubs() => ', result);
    setRsoList(result);
    setIsMember(result.map(x => x.isMember));
  }

  useEffect(() => {
    getClubs();
  }, []);

  const toggleRsoMembership = async (rso_id, isMem) => {
    const body = { RSO_ID:rso_id, Email:email };
    if (isMem) {
      const response = await fetch("http://localhost:5000/rso_member/", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      return await response.json();
    } else {
      const response = await fetch("http://localhost:5000/rso_member/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      return await response.json();
    }
  }

  const handle = async (e, i) => {
    if (await toggleRsoMembership(rsoList[i].RSO_ID, isMember[i])) {
      setIsMember(isMember.map((item, index) => 
        index == i ?
          !item :
          item
      ));
    }
  }

  return <div className="mx-auto border border-2 rounded col-md-6 shadow my-4 p-3">
    <h3>Manage RSO Membership</h3>
    {rsoList.map((item, index) => 
      <div className="form-check" key={index}>
        <label class="form-check-label">{item.RSO_name}: 
          <input class="form-check-input" type="checkbox" checked={isMember[index]} key={index}onChange={e => handle(e, index)}/>
        </label>
      </div>
    )}
  </div>
}

export default Clubs;