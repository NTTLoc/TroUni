import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  ProgressBar,
  Badge,
  Modal,
  ListGroup,
  Alert,
} from "react-bootstrap";
import {
  FaTrophy,
  FaMedal,
  FaStar,
  FaGift,
  FaFire,
  FaHeart,
  FaShare,
  FaBookmark,
  FaBell,
  FaCheckCircle,
  FaRocket,
  FaCrown,
} from "react-icons/fa";

const GamificationFeatures = () => {
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [userPoints, setUserPoints] = useState(1250);
  const [userLevel, setUserLevel] = useState(3);
  const [userStreak, setUserStreak] = useState(7);
  const [achievements, setAchievements] = useState([]);

  // Mock achievements data
  const availableAchievements = [
    {
      id: 1,
      title: "Người mới",
      description: "Đăng ký tài khoản lần đầu",
      icon: "🌟",
      points: 100,
      unlocked: true,
      date: "2024-01-15",
    },
    {
      id: 2,
      title: "Nhà thám hiểm",
      description: "Xem 10 phòng trọ khác nhau",
      icon: "🔍",
      points: 200,
      unlocked: true,
      date: "2024-01-20",
    },
    {
      id: 3,
      title: "Người đánh giá",
      description: "Đánh giá 5 phòng trọ",
      icon: "⭐",
      points: 300,
      unlocked: false,
      progress: 3,
      target: 5,
    },
    {
      id: 4,
      title: "Chia sẻ viên",
      description: "Chia sẻ 20 phòng trọ",
      icon: "📤",
      points: 400,
      unlocked: false,
      progress: 12,
      target: 20,
    },
    {
      id: 5,
      title: "Người yêu thích",
      description: "Yêu thích 50 phòng trọ",
      icon: "❤️",
      points: 500,
      unlocked: false,
      progress: 35,
      target: 50,
    },
    {
      id: 6,
      title: "Chuyên gia",
      description: "Đạt level 5",
      icon: "👑",
      points: 1000,
      unlocked: false,
      progress: 3,
      target: 5,
    },
  ];

  const rewards = [
    {
      id: 1,
      title: "Giảm 10% phí dịch vụ",
      description: "Áp dụng cho lần đăng tin tiếp theo",
      points: 500,
      icon: "🎫",
      available: true,
    },
    {
      id: 2,
      title: "Miễn phí 1 tháng",
      description: "Áp dụng cho phòng trọ được chọn",
      points: 1000,
      icon: "🏠",
      available: true,
    },
    {
      id: 3,
      title: "Tư vấn miễn phí",
      description: "Tư vấn chọn phòng trọ 30 phút",
      points: 300,
      icon: "💬",
      available: true,
    },
    {
      id: 4,
      title: "Ưu tiên hiển thị",
      description: "Tin đăng được ưu tiên hiển thị 1 tuần",
      points: 800,
      icon: "🚀",
      available: false,
    },
  ];

  const dailyTasks = [
    {
      id: 1,
      title: "Xem 3 phòng trọ mới",
      points: 50,
      completed: true,
      icon: "👀",
    },
    {
      id: 2,
      title: "Đánh giá 1 phòng trọ",
      points: 100,
      completed: false,
      icon: "⭐",
    },
    {
      id: 3,
      title: "Chia sẻ 2 phòng trọ",
      points: 75,
      completed: false,
      icon: "📤",
    },
    {
      id: 4,
      title: "Yêu thích 5 phòng trọ",
      points: 25,
      completed: true,
      icon: "❤️",
    },
  ];

  const getLevelInfo = (level) => {
    const levels = {
      1: { name: "Người mới", color: "secondary", minPoints: 0 },
      2: { name: "Thành viên", color: "info", minPoints: 500 },
      3: { name: "Chuyên gia", color: "primary", minPoints: 1000 },
      4: { name: "Master", color: "warning", minPoints: 2000 },
      5: { name: "Legend", color: "danger", minPoints: 5000 },
    };
    return levels[level] || levels[1];
  };

  const getNextLevelPoints = () => {
    const currentLevel = getLevelInfo(userLevel);
    const nextLevel = getLevelInfo(userLevel + 1);
    return nextLevel ? nextLevel.minPoints - userPoints : 0;
  };

  const levelInfo = getLevelInfo(userLevel);

  return (
    <div className="gamification-section">
      <div className="container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold section-title">
            🏆 Hệ thống thành tích & phần thưởng
          </h2>
          <p className="lead text-muted">
            Tích điểm, mở khóa thành tích và nhận phần thưởng hấp dẫn
          </p>
        </div>

        {/* User Profile Card */}
        <Row className="mb-5">
          <Col lg={8} className="mb-4">
            <Card className="profile-card">
              <Card.Body>
                <div className="d-flex align-items-center mb-4">
                  <div className="profile-avatar me-3">
                    <img
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt="User"
                      className="rounded-circle"
                      style={{ width: 80, height: 80, objectFit: "cover" }}
                    />
                    <div className="level-badge">
                      <FaCrown className="text-warning" />
                    </div>
                  </div>
                  <div className="profile-info">
                    <h4 className="fw-bold mb-1">Nguyễn Văn A</h4>
                    <Badge bg={levelInfo.color} className="mb-2">
                      {levelInfo.name}
                    </Badge>
                    <div className="points-info">
                      <FaStar className="text-warning me-1" />
                      <span className="fw-bold">
                        {userPoints.toLocaleString()}
                      </span>{" "}
                      điểm
                    </div>
                  </div>
                  <div className="ms-auto text-end">
                    <div className="streak-info">
                      <FaFire className="text-danger me-1" />
                      <span className="fw-bold">{userStreak}</span> ngày liên
                      tiếp
                    </div>
                    <small className="text-muted">Đăng nhập hàng ngày</small>
                  </div>
                </div>

                {/* Level Progress */}
                <div className="level-progress mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>Tiến độ level</span>
                    <span className="text-muted">
                      {userPoints}/
                      {getLevelInfo(userLevel + 1)?.minPoints || userPoints}{" "}
                      điểm
                    </span>
                  </div>
                  <ProgressBar
                    now={
                      (userPoints /
                        (getLevelInfo(userLevel + 1)?.minPoints ||
                          userPoints)) *
                      100
                    }
                    variant={levelInfo.color}
                    className="mb-2"
                  />
                  <small className="text-muted">
                    Cần thêm {getNextLevelPoints()} điểm để lên level{" "}
                    {userLevel + 1}
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4} className="mb-4">
            <Card className="rewards-preview-card">
              <Card.Body className="text-center">
                <div className="rewards-icon mb-3">
                  <FaGift />
                </div>
                <h5 className="fw-bold mb-3">Phần thưởng có sẵn</h5>
                <div className="available-rewards mb-3">
                  {rewards
                    .filter((r) => r.available)
                    .slice(0, 2)
                    .map((reward, index) => (
                      <div key={reward.id} className="reward-item mb-2">
                        <span className="reward-icon">{reward.icon}</span>
                        <span className="reward-title">{reward.title}</span>
                        <Badge bg="success" className="ms-2">
                          {reward.points} điểm
                        </Badge>
                      </div>
                    ))}
                </div>
                <Button
                  variant="primary"
                  onClick={() => setShowRewardsModal(true)}
                  className="w-100"
                >
                  Xem tất cả phần thưởng
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Daily Tasks */}
        <Row className="mb-5">
          <Col lg={6} className="mb-4">
            <Card className="tasks-card">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">
                  <FaCheckCircle className="me-2" />
                  Nhiệm vụ hàng ngày
                </h5>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  {dailyTasks.map((task) => (
                    <ListGroup.Item
                      key={task.id}
                      className="d-flex align-items-center"
                    >
                      <span className="task-icon me-3">{task.icon}</span>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center">
                          <span
                            className={
                              task.completed
                                ? "text-decoration-line-through"
                                : ""
                            }
                          >
                            {task.title}
                          </span>
                          <Badge bg={task.completed ? "success" : "secondary"}>
                            {task.points} điểm
                          </Badge>
                        </div>
                      </div>
                      {task.completed && (
                        <FaCheckCircle className="text-success ms-2" />
                      )}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <div className="text-center mt-3">
                  <small className="text-muted">
                    Hoàn thành tất cả nhiệm vụ để nhận thêm 100 điểm bonus!
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6} className="mb-4">
            <Card className="achievements-card">
              <Card.Header className="bg-warning text-dark">
                <h5 className="mb-0">
                  <FaTrophy className="me-2" />
                  Thành tích gần đây
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="achievements-grid">
                  {availableAchievements.slice(0, 4).map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`achievement-item ${
                        achievement.unlocked ? "unlocked" : "locked"
                      }`}
                    >
                      <div className="achievement-icon">{achievement.icon}</div>
                      <div className="achievement-info">
                        <div className="achievement-title">
                          {achievement.title}
                        </div>
                        <div className="achievement-points">
                          {achievement.points} điểm
                        </div>
                        {!achievement.unlocked && achievement.progress && (
                          <ProgressBar
                            now={
                              (achievement.progress / achievement.target) * 100
                            }
                            size="sm"
                            className="mt-1"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-3">
                  <Button variant="outline-warning" size="sm">
                    Xem tất cả thành tích
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Leaderboard */}
        <Row className="mb-5">
          <Col>
            <Card className="leaderboard-card">
              <Card.Header className="bg-success text-white">
                <h5 className="mb-0">
                  <FaMedal className="me-2" />
                  Bảng xếp hạng tuần
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="leaderboard-list">
                  {[
                    {
                      rank: 1,
                      name: "Trần Thị B",
                      points: 8500,
                      avatar:
                        "https://randomuser.me/api/portraits/women/44.jpg",
                    },
                    {
                      rank: 2,
                      name: "Lê Văn C",
                      points: 7200,
                      avatar: "https://randomuser.me/api/portraits/men/65.jpg",
                    },
                    {
                      rank: 3,
                      name: "Nguyễn Văn A",
                      points: 6800,
                      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                    },
                    {
                      rank: 4,
                      name: "Phạm Thị D",
                      points: 5500,
                      avatar:
                        "https://randomuser.me/api/portraits/women/22.jpg",
                    },
                    {
                      rank: 5,
                      name: "Hoàng Văn E",
                      points: 4800,
                      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
                    },
                  ].map((user, index) => (
                    <div key={user.rank} className="leaderboard-item">
                      <div className="rank-badge">
                        {index < 3 ? (
                          <FaMedal
                            className={
                              index === 0
                                ? "text-warning"
                                : index === 1
                                ? "text-secondary"
                                : "text-bronze"
                            }
                          />
                        ) : (
                          <span>{user.rank}</span>
                        )}
                      </div>
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="user-avatar"
                      />
                      <div className="user-info">
                        <div className="user-name">{user.name}</div>
                        <div className="user-points">
                          {user.points.toLocaleString()} điểm
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Rewards Modal */}
        <Modal
          show={showRewardsModal}
          onHide={() => setShowRewardsModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaGift className="me-2" />
              Cửa hàng phần thưởng
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert variant="info" className="mb-4">
              <strong>Điểm hiện tại:</strong> {userPoints.toLocaleString()} điểm
            </Alert>

            <Row>
              {rewards.map((reward) => (
                <Col key={reward.id} md={6} className="mb-3">
                  <Card
                    className={`reward-card ${
                      !reward.available ? "disabled" : ""
                    }`}
                  >
                    <Card.Body className="text-center">
                      <div className="reward-icon-large mb-3">
                        {reward.icon}
                      </div>
                      <h6 className="fw-bold">{reward.title}</h6>
                      <p className="text-muted small">{reward.description}</p>
                      <Badge
                        bg={reward.available ? "success" : "secondary"}
                        className="mb-3"
                      >
                        {reward.points} điểm
                      </Badge>
                      <Button
                        variant={reward.available ? "primary" : "secondary"}
                        size="sm"
                        disabled={
                          !reward.available || userPoints < reward.points
                        }
                        className="w-100"
                      >
                        {userPoints >= reward.points
                          ? "Đổi ngay"
                          : "Không đủ điểm"}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Modal.Body>
        </Modal>
      </div>

      <style jsx>{`
        .gamification-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .profile-card {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          backdrop-filter: blur(10px);
        }

        .profile-avatar {
          position: relative;
        }

        .level-badge {
          position: absolute;
          bottom: -5px;
          right: -5px;
          background: white;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .points-info {
          font-size: 1.1rem;
        }

        .streak-info {
          font-size: 1.2rem;
          margin-bottom: 5px;
        }

        .rewards-preview-card {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          backdrop-filter: blur(10px);
        }

        .rewards-icon {
          font-size: 2.5rem;
          color: #ffd700;
        }

        .reward-item {
          display: flex;
          align-items: center;
          padding: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          margin-bottom: 8px;
        }

        .reward-icon {
          margin-right: 10px;
          font-size: 1.2rem;
        }

        .reward-title {
          flex-grow: 1;
          font-size: 0.9rem;
        }

        .tasks-card,
        .achievements-card,
        .leaderboard-card {
          background: white;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
          border: none;
        }

        .task-icon {
          font-size: 1.2rem;
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .achievement-item {
          display: flex;
          align-items: center;
          padding: 10px;
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .achievement-item.unlocked {
          background: rgba(40, 167, 69, 0.1);
          border: 1px solid rgba(40, 167, 69, 0.3);
        }

        .achievement-item.locked {
          background: rgba(108, 117, 125, 0.1);
          border: 1px solid rgba(108, 117, 125, 0.3);
          opacity: 0.7;
        }

        .achievement-icon {
          font-size: 1.5rem;
          margin-right: 10px;
        }

        .achievement-title {
          font-weight: bold;
          font-size: 0.9rem;
        }

        .achievement-points {
          font-size: 0.8rem;
          color: #666;
        }

        .leaderboard-list {
          max-height: 300px;
          overflow-y: auto;
        }

        .leaderboard-item {
          display: flex;
          align-items: center;
          padding: 15px;
          border-bottom: 1px solid #eee;
        }

        .leaderboard-item:last-child {
          border-bottom: none;
        }

        .rank-badge {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          font-weight: bold;
        }

        .user-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
          margin-right: 15px;
        }

        .user-name {
          font-weight: bold;
        }

        .user-points {
          color: #666;
          font-size: 0.9rem;
        }

        .reward-card {
          border-radius: 15px;
          transition: all 0.3s ease;
        }

        .reward-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .reward-card.disabled {
          opacity: 0.6;
        }

        .reward-icon-large {
          font-size: 3rem;
        }

        .text-bronze {
          color: #cd7f32;
        }

        @media (max-width: 768px) {
          .achievements-grid {
            grid-template-columns: 1fr;
          }

          .leaderboard-item {
            padding: 10px;
          }

          .rank-badge {
            width: 30px;
            height: 30px;
            margin-right: 10px;
          }

          .user-avatar {
            width: 40px;
            height: 40px;
            margin-right: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default GamificationFeatures;
