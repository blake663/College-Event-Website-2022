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

  return <>
    <h3>Manage RSO Membership:</h3>
    <table>
      <tbody>
        {rsoList.map((item, index) => 
          <tr key={index}>
            <td style={{paddingRight: "20px"}}>
              {item.RSO_name}: 
            </td>
            <td>
              <input type="checkbox" checked={isMember[index]} key={index}onChange={e => handle(e, index)}/>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </>
}

export default Clubs;