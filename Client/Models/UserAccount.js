class UserAccount {
  constructor(
    _id,
    _username,
    _password,
    _avatar,
    _roleId,
    _memberShipId,
    _rewardPoint,
    _accessToken
  ) {
    this.id = _id;
    this.username = _username;
    this.password = _password;
    this.avatar = _avatar;
    this.roleId = _roleId;
    this.memberShipId = _memberShipId;
    this.rewardPoint = _rewardPoint;
    this.accessToken = _accessToken;
  }
}
export default UserAccount;
