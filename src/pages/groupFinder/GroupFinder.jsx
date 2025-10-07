import React, { useState } from "react";
import { Row, Col, Card, Button, List } from "antd";
import GroupForm from "../../features/groupFinder/groupForm/GroupForm";
import GroupCard from "../../features/groupFinder/groupCard/GroupCard.jsx";
import "./GroupFinder.scss";

const dummyGroups = [
  { id: 1, name: "Nhóm nữ Khoa CNTT", members: 2, capacity: 4 },
  { id: 2, name: "Nhóm nam Y Dược", members: 3, capacity: 4 },
];

const GroupFinder = () => {
  const [groups, setGroups] = useState(dummyGroups);

  return (
    <div className="group-finder">
      <Row gutter={16}>
        {/* Form tạo nhóm */}
        <Col span={8}>
          <Card title="Tạo nhóm mới">
            <GroupForm onCreate={(g) => setGroups([...groups, g])} />
          </Card>
        </Col>

        {/* Danh sách nhóm */}
        <Col span={16}>
          <Card title="Danh sách nhóm">
            <List
              dataSource={groups}
              renderItem={(g) => <GroupCard data={g} />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default GroupFinder;
